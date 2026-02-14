from __future__ import annotations

import logging

from rest_framework import status, serializers
from rest_framework.views import APIView
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from samfundet.models.mdb import sett_lim_utvidet_medlemsinfo

logger = logging.getLogger('samfundet.views.mdb_views')


class ConnectToMDBSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, min_length=1)


class ConnectToMDBView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request: Request) -> Response:
        user = request.user

        if user.mdb_medlem_id:
            return Response({'message': 'You have already connected to MDB'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = ConnectToMDBSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data['email']
        password = serializer.validated_data['password']

        logger.info(f'User #{user.id} attempting to connect to MDB with email {email}...')

        medlem_id = sett_lim_utvidet_medlemsinfo(email, password)
        if medlem_id:
            user.mdb_medlem_id = medlem_id
            user.save()
            logger.info(f'Connected user #{user.id} to MDB with medlem_id {medlem_id}')
            return Response({'message': 'Successfully connected account to MDB!'})

        return Response(status=status.HTTP_400_BAD_REQUEST)
