# -*- coding: utf-8 -*-
"""
Builds epub book out of Paul Graham's essays: http://paulgraham.com/articles.html

Author: Ola Sitarska <ola@sitarska.com>
Copyright: Licensed under the GPL-3 (http://www.gnu.org/licenses/gpl-3.0.html)

This script requires python-epub-library: http://code.google.com/p/python-epub-builder/
"""

import re, urllib2, genshi
import redis
import json
import os
import base64
import sys
from BeautifulSoup import BeautifulSoup

def goodP(p):
    return not 'January' in p \
            and not 'February' in p \
            and not 'March' in p \
            and not 'April' in p \
            and not 'May' in p \
            and not 'June' in p \
            and not 'July' in p \
            and not 'August' in p \
            and not 'September' in p \
            and not 'October' in p \
            and not 'November' in p \
            and not 'December' in p \
            and not len(p)<300 \
            and not "Thanks to" in p \
            and not "Thanksto" in p \
            and not "reading drafts" in p \
            and not "Note:" in p \
            and not "Like This" in p \
            and not "Comment on this" in p


def goodContent(font):
    return not 'Get funded by' in font \
            and not 'Watch how this essay was' in font \
            and not 'Like to build things?' in font \
            and not len(font)<100


def getContent(soup):
    try:
        font = str(soup.findAll('table', {'width':'435'})[0].findAll('font')[0])
        if goodContent(font):
            return font

        font = str(soup.findAll('p'))
        if goodContent(font):
            return font
    except:
        return []


def grabEssay(link):
    ret = list()

    if not 'http' in link:
        page = urllib2.urlopen('http://www.paulgraham.com/'+link).read()
        soup = BeautifulSoup(page)
        soup.prettify()
    else:
        page = urllib2.urlopen(link).read()

    if not 'http' in link:
        content = getContent(soup)
        if not content:
            return ret

        for p in content.split("<br /><br />"):
            if goodP(p):
                l = p
                try:
                    bs = BeautifulSoup(genshi.core.Markup(p))
                    l = bs.getText(" ")
                except:
                    pass

                k = re.sub('\r\n', ' ', str(l))
                k = re.sub('\n', ' ', k)
                k = re.sub('&\S+;', '', k)
                k = re.sub('\[ \d+ \]', '', k)
                k = re.sub('\[\d+\]', '', k)
                k = re.sub('\w+=\d+', '', k)
                k = re.sub('a href=\"\S+\"', '', k)
                k = re.sub('<\w+[\S\s]+>', '', k)
                k = re.sub('  ',' ', k)
                k = k.strip()

                ret.append(k)

    return ret

if __name__ == "__main__":
    page = urllib2.urlopen('http://www.paulgraham.com/articles.html').read()
    soup = BeautifulSoup(page)
    soup.prettify()

    quotes = {}
    links = soup.findAll('table', {'width': '435'})[1].findAll('a')

    l = len(links)
    for link in links:
        sys.stderr.write(link.text + "\n")

        v = 1
        for k in grabEssay(link['href']):
            quote = {
                    'quote': k,
                    'essay': link.text,
                    'url': link['href'],
            }
            uuid = base64.urlsafe_b64encode(os.urandom(6))
            quotes[uuid] = quote
            #r.hset(uuid, 'verse', str(l) + ":" + str(v))

            v = v + 1

        l = l - 1

    print(json.dumps(quotes, indent=1))

