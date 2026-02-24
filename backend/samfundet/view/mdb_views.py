from __future__ import annotations

import logging

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from samfundet.models.mdb import sett_lim_utvidet_medlemsinfo
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

        logger.info(f'User #{user.id} attempting to connect to MDB with email {member_login}...')

        medlem_id = sett_lim_utvidet_medlemsinfo(member_login, password)
        if medlem_id:
            user.mdb_medlem_id = medlem_id
            user.save()
            logger.info(f'Connected user #{user.id} to MDB with medlem_id {medlem_id}')
            return Response({'message': 'Successfully connected account to MDB!'})

        return Response(status=status.HTTP_400_BAD_REQUEST)
