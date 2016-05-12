# -*- coding: utf-8 -*-
"""
Builds epub book out of Paul Graham's essays: http://paulgraham.com/articles.html

Author: Ola Sitarska <ola@sitarska.com>
Copyright: Licensed under the GPL-3 (http://www.gnu.org/licenses/gpl-3.0.html)

This script requires python-epub-library: http://code.google.com/p/python-epub-builder/
"""

from pgessays import grabEssay

print grabEssay("guidetoinvestors.html")

