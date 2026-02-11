import os
import uuid
from werkzeug.utils import secure_filename
from flask import url_for,current_app

class ImageService:

    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    UPLOAD_FOLDER = os.path.join(os.getcwd(), 'app', 'static', 'uploads')
    os.makedirs(UPLOAD_FOLDER,exist_ok=True)

    @staticmethod
    def upload_image(file_storage_object,folder) -> str:
        """
            Prima fajl iz request.files, čuva ga lokalno 
            i vraća URL putanju koju čuvaš u bazi.
        """
        if not file_storage_object:
            return None
        
        original_name = secure_filename(file_storage_object.filename)
        extension = original_name.rsplit('.',1)[1].lower()

        unique_filename = f"{uuid.uuid4().hex}.{extension}"

        full_upload_path = os.path.join(ImageService.UPLOAD_FOLDER, folder)
        os.makedirs(full_upload_path, exist_ok=True) 
    
        file_path = os.path.join(full_upload_path, unique_filename)

        file_storage_object.save(file_path)

        return f"/static/uploads/{folder}/{unique_filename}"
    
    @staticmethod
    def delete_image(image_url):
        """
            Prima URL iz baze (npr. /static/uploads/profile-images/xyz.jpg)
            i briše taj fajl sa diska.
        """
        if not image_url:
            return False

        # Zaštita default slika
        if "default-" in image_url:
            return False

        try:
            file_path = os.path.join('app', image_url.lstrip('/'))

            if os.path.exists(file_path):
                os.remove(file_path)
                return True
            return False
        except Exception as e:
            print(f"Greška pri brisanju: {e}")
            return False