import logging

from django.shortcuts import get_object_or_404
from rest_framework import permissions, viewsets, status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.authentication import TokenAuthentication

from .models import File
from .serializers import FileSerializer


logger = logging.getLogger(__name__)


class FileViewSet(viewsets.ModelViewSet):
    queryset = File.objects.all()
    serializer_class = FileSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [TokenAuthentication]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_anonymous:
            return File.objects.none()
        if user.is_staff:
            return File.objects.all()
        return File.objects.filter(by_user=user.id)


    def post(self, request, format=None):
        serializer = FileSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED, content_type='application/json')
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST, content_type='application/json')
    
    def update(self, request, *args, **kwargs):
        try:
            partial = kwargs.pop('partial', False)
            instance = self.get_object()
            serializer = self.get_serializer(instance, data=request.data, partial=partial)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            response_message = f"File with id='{instance.id}' was successfully updated by user '{instance.by_user}'."
            logger.info(response_message)
        except Exception as e:
            response_message = f"File was not updated. Error: {e}."
            logger.error(response_message)
            return Response({'response': response_message},
                            status=status.HTTP_400_BAD_REQUEST,
                            content_type='application/json')
        return Response({'response': response_message},
                            status=status.HTTP_200_OK,
                            content_type='application/json')

    def perform_update(self, serializer):
        new_filename = self.request.data.get("name", None)
        if new_filename:
            serializer.instance.new_filename = new_filename
        serializer.save()

    def destroy(self, request, *args, **kwargs):
        
        for k, v in kwargs.items():
            for id in v.split(','):
                try:
                    obj = get_object_or_404(File, pk=int(id))
                    logger.info(
                        f"File '{obj.filename}' delete was initialized by user '{obj.by_user}'.")
                    self.perform_destroy(obj)
                    response_message = f"File '{obj.filename}' was successfully deleted by user '{obj.by_user}'."
                    logger.warning(response_message)

                except Exception as e:
                    response_message = f"File {obj.filename} was not deleted. Error: {e}."
                    logger.error(response_message)
                    return Response({'response': response_message},
                                    status=status.HTTP_400_BAD_REQUEST,
                                    content_type='application/json')

        return Response({'response': response_message},
                        status=status.HTTP_204_NO_CONTENT,
                        content_type='application/json')
