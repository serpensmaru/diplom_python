import os
import math
import logging

from django.db import models
from django.utils import timezone
from django.dispatch import receiver
from django.conf import settings

from dotenv import load_dotenv

from accounts.models import User


load_dotenv()

logger = logging.getLogger(__name__)


def check_unique_filename(userfolder, filename):
    new_filepath = os.path.join(userfolder, filename)
    if File.objects.filter(file=new_filepath):
        filename = get_available_name(userfolder, filename)
    return filename
    

def get_available_name(userfolder, filename):
    count = 0
    file_root, file_ext = os.path.splitext(filename)
    while File.objects.filter(file=os.path.join(userfolder, filename)):
        count += 1
        filename = f'{file_root}_{count}{file_ext}'
    return filename

def convert_size(size_bytes):
    size_name = ('B', 'KB', 'MB', 'GB')
    i = int(math.floor(math.log(size_bytes, 1024)))
    s = round(size_bytes / math.pow(1024, i), 2)
    return f'{s} {size_name[i]}'


class File(models.Model):
    id = models.AutoField(primary_key=True)
    file = models.FileField(null=True, verbose_name='file in storage')
    filename = models.CharField(max_length=255, null=True, default='')
    description = models.TextField(null=True, default='')
    size = models.CharField(null=True, default='')
    share_link = models.CharField(max_length=100, null=True, default='')
    upload_datetime = models.DateTimeField(default=timezone.now)
    by_user = models.ForeignKey(User, on_delete=models.CASCADE, default=1)

    def save(self, *args, **kwargs):

        userfolder = self.by_user.username
        hash_link = hash(self.upload_datetime)

        if self.id:
            logger.info(f"Update file with id='{self.id}' and filename='{self.filename}' was initialized by {self.by_user}.")
            old_full_filepath = self.file.path
            new_full_filepath = os.path.join(settings.MEDIA_ROOT, userfolder, self.filename)
            self.file.name = os.path.join(userfolder, self.filename)
            os.rename(old_full_filepath, new_full_filepath)
        else:
            file_root, file_ext = os.path.splitext(self.file.name)

            if self.filename:
                self.filename = check_unique_filename(userfolder, f'{self.filename}{file_ext}')
                self.file.name = os.path.join(userfolder, self.filename)
            else:
                self.filename = self.file.name
                self.file.name = os.path.join(userfolder, f'{hash_link}{file_ext}')

            self.share_link = os.path.join(os.getenv('REACT_APP_API_URL'), 's', f'file{hash_link}')
            self.size = convert_size(self.file.size)

        super().save(*args, **kwargs)

    def __str__(self):
        return str(self.file.name)


@receiver(models.signals.post_delete, sender=File)
def auto_delete_file_on_delete(sender, instance, **kwargs):
    if instance.file and os.path.isfile(instance.file.path):
        os.remove(instance.file.path)
