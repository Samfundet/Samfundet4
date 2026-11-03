from __future__ import annotations

import logging

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from django.db import DatabaseError

from samfundet.models.mdb import populate_user_from_mdb, sett_lim_utvidet_medlemsinfo
from samfundet.models.general import User
from samfundet.serializer.mdb_serializers import ConnectToMDBSerializer

logger = logging.getLogger('samfundet.views.mdb_views')


class ConnectToMDBView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request: Request) -> Response:
        user = request.user

        if user.mdb_medlem_id:
            return Response({'message': 'You have already connected to MDB'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = ConnectToMDBSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        member_login = serializer.validated_data['member_login']
        password = serializer.validated_data['password']

        logger.info(f'User #{user.id} attempting to connect to MDB with login {member_login}...')

        medlem_id = sett_lim_utvidet_medlemsinfo(member_login, password)
        if not medlem_id:
            return Response({'message': 'Invalid member login or password'}, status=status.HTTP_400_BAD_REQUEST)

        # mdb_medlem_id is unique: without this check, a second account connecting
        # to the same membership crashes with an IntegrityError (500).
        if User.objects.filter(mdb_medlem_id=medlem_id).exclude(pk=user.pk).exists():
            return Response(
                {'message': 'This membership is already connected to another account'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.mdb_medlem_id = medlem_id
        self._populate_mdb_fields(user)
        user.save()

        logger.info(f'Connected user #{user.id} to MDB with medlem_id {medlem_id}')
        return Response({'message': 'Successfully connected account to MDB!'})

    @staticmethod
    def _populate_mdb_fields(user: User) -> None:
        """Copy member details from MDB. Never fails the connection itself."""
        try:
            if not populate_user_from_mdb(user):
                logger.warning(f'User #{user.id} connected to MDB, but medlem_id {user.mdb_medlem_id} was not found in MedlemsInfo')
        except DatabaseError:
            logger.exception(f'Failed to fetch MDB info for user #{user.id} (medlem_id {user.mdb_medlem_id})')
