from django.contrib import admin
from django.utils.html import format_html

from . import models


@admin.register(models.File)
class FileAdmin(admin.ModelAdmin):
    list_display = ('filename', 'upload_datetime', 'by_user', 'get_original_file','share_link')
    readonly_fields = ('share_link', 'size', )
    
    def get_original_file(self, obj):
        return format_html("<a href='%s' target='_blank'><button type='button'>download</button></a>" % (obj.share_link,))

    get_original_file.short_description = 'original_file'
