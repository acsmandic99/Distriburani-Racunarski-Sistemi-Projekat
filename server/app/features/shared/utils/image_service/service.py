import os
import uuid
from werkzeug.utils import secure_filename
from flask import url_for

class ImageService:

    UPLOAD_FOLDER = 'app/static/uploads/'
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
        folder = ImageService.UPLOAD_FOLDER + folder
        file_path = os.path.join(folder,unique_filename)

        file_storage_object.save(file_path)

        return f"/static/uploads/recipes/{unique_filename}"