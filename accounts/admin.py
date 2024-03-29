from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import Group

from .models import User
from storage.models import File


class FileInline(admin.TabularInline):
    model = File
    extra = 0
    max_num = 0
    exclude = ('file_url', 'file',)
    readonly_fields = ('upload_datetime', 'share_link')


class MyUserAdmin(UserAdmin):
    model = User
    inlines = (FileInline, )
    list_filter = ()
    list_display = ('username', 'joined_at', 'file_count',
                    'is_active', 'is_staff', )
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Permissions', {'fields': ('is_staff', 'is_active')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'password1', 'password2', 'is_staff', 'is_active'),
        }),
    )

    def file_count(self, obj):
        return obj.file_set.count()


admin.site.register(User, MyUserAdmin)
admin.site.unregister(Group)
