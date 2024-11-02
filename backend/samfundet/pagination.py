from __future__ import annotations

from rest_framework.pagination import CursorPagination, PageNumberPagination, LimitOffsetPagination


# 1. Page Number Pagination
class CustomPageNumberPagination(PageNumberPagination):
    page_size = 25
    page_size_query_param = 'page_size'
    max_page_size = 50
    # URLs will look like: /api/items/?page=2


# 2. Limit-Offset Pagination
class CustomLimitOffsetPagination(LimitOffsetPagination):
    default_limit = 10
    max_limit = 100
    # URLs will look like: /api/items/?limit=10&offset=20


# # 3. Cursor Pagination (good for infinite scroll)
class CustomCursorPagination(CursorPagination):
    page_size = 10
    ordering = '-created_at'  # Must specify ordering field
    # URLs will use an encoded cursor: /api/items/?cursor=cD0yMDIy


class UserCursorPagination(CursorPagination):
    page_size = 10
    ordering = '-date_joined'  # Default ordering by newest first
    cursor_query_param = 'cursor'
    ordering_fields = ('date_joined', 'id')
