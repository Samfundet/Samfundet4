from __future__ import annotations

from typing import Any

from rest_framework.response import Response
from rest_framework.pagination import CursorPagination, PageNumberPagination, LimitOffsetPagination


# Page Number Pagination
class CustomPageNumberPagination(PageNumberPagination):
    """
    Custom page number pagination.
    Implementing this in some view will make the view return a limited amount of objects, defined by page_size.
    """

    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 50

    def get_paginated_response(self, data: Any) -> Response:
        """These are the pagination properties of CustomPageNumberPagination."""
        return Response(
            {
                'page_size': self.get_page_size(self.request),
                'count': self.page.paginator.count,
                'next': self.get_next_link(),
                'previous': self.get_previous_link(),
                'current_page': self.page.number,
                'total_pages': self.page.paginator.num_pages,
                'results': data,
            }
        )

    # URLs will look like: /api/items/?page=2


# Limit-Offset Pagination
class CustomLimitOffsetPagination(LimitOffsetPagination):
    default_limit = 10
    max_limit = 100
    # URLs will look like: /api/items/?limit=10&offset=20


# Cursor Pagination (good for infinite scroll)
class CustomCursorPagination(CursorPagination):
    page_size = 10
    ordering = '-created_at'  # Must specify ordering field
    # URLs will use an encoded cursor: /api/items/?cursor=cD0yMDIy


class UserCursorPagination(CursorPagination):
    """implementation of custom cursor pagination for users"""

    page_size = 10
    ordering = '-date_joined'  # Default ordering by newest first
    cursor_query_param = 'cursor'
    ordering_fields = ('date_joined', 'id')
