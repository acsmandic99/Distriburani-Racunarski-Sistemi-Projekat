from flask import Request

class RecipeParser:
    @staticmethod
    def parse_create_data(request: Request) -> dict:
        """
        Izvlači i transformiše podatke iz multipart/form-data zahteva.
        """
        data = request.form.to_dict()
        lsit_fields = ['ingredients','steps','additional_marks']
        for field in lsit_fields:
            data[field] = request.form.getlist(field)
        print(data)
        return data