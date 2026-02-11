from app.extensions import mongo
from bson import ObjectId
from ..users.services import UserService
from ..recipes.services import RecipeService
from ..reviews.services import ReviewService
from ..author_managment.services import AuthorManagmentService
from ..shared.constants import messages
from fpdf import FPDF
from ..shared.utils.email_sender import launch_email_process
class AdminService:
    @staticmethod
    def get_users(base_url):
        users = UserService.get_users(base_url)
        return users

    @staticmethod
    def get_recipes():
        recipes = RecipeService.get_all_recipes(1,50)
        return recipes

    @staticmethod
    def get_all_author_requests():
        requests = AuthorManagmentService.get_all_author_requests()
        return requests
    
    @staticmethod
    def aprove_author_request(request_id):
        try:
            oid = ObjectId(request_id)
        except Exception:
            raise ValueError(messages.REQUEST_NOT_FOUND)
        
        AuthorManagmentService.approve_request(oid)

        request_data = AuthorManagmentService.get_request_by_id(oid)
        user_id = request_data.get("user_id") 

        user_email = UserService.get_user_email(user_id)
        launch_email_process(user_email, "Zahtev odobren", "Sada ste autor!")
        
        
    @staticmethod
    def reject_author_request(request_id):
        try:
            oid = ObjectId(request_id)
        except Exception as e:
            print(f"Reject author ID error: {str(e)}")
            raise ValueError(messages.REQUEST_NOT_FOUND)
            
        AuthorManagmentService.reject_request(oid)

        request_data = AuthorManagmentService.get_request_by_id(oid)
        user_id = request_data.get("user_id") 
        
        user_email = UserService.get_user_email(user_id)
        launch_email_process(user_email, "Zahtev odbijen", "Vas zahtev za autora je nazalost odbijen!")


    @staticmethod
    def delete_user_account(user_id):
        try:
            oid = ObjectId(user_id)
        except Exception:
            raise ValueError(messages.INVALID_DATA_FORMAT)
        
        user_email = UserService.get_user_email(oid)
        launch_email_process(user_email, "Nalog obrisan", "Vas nalog je nazalost obrisan!")
        UserService.delete_user_completely(oid)



    @staticmethod
    def get_platform_stats():
        """Vraća osnovne brojke za dashboard."""
        stats = {
            "total_users": UserService.get_all_users_count(),
            "total_recipes": RecipeService.get_all_recipes_count(),
            "total_reviews": ReviewService.get_all_reviews_count()
        }
        return stats

    @staticmethod
    def generate_top_authors_pdf():
        top_authors = UserService.get_top_n_authors(5)

        pdf = FPDF()
        pdf.add_page()
        pdf.set_font("Arial", "B", 16)
        
        pdf.cell(190, 10, "Izvestaj o Platformi - Top Autori", ln=True, align="C")
        pdf.ln(10)

        stats = AdminService.get_platform_stats()
        pdf.set_font("Arial", "", 12)
        pdf.cell(100, 10, f"Ukupan broj korisnika: {stats['total_users']}", ln=True)
        pdf.cell(100, 10, f"Ukupan broj recepata: {stats['total_recipes']}", ln=True)
        pdf.ln(10)

        pdf.set_font("Arial", "B", 12)
        pdf.cell(40, 10, "Ime autora", border=1)
        pdf.cell(70, 10, "Email autora", border=1)
        pdf.cell(40, 10, "Prosecna Ocena", border=1)
        pdf.cell(40, 10, "Broj Ocena", border=1, ln=True)

        pdf.set_font("Arial", "", 12)
        for author in top_authors:
            pdf.cell(40, 10, str(author.get("first_name")), border=1)
            pdf.cell(70, 10, str(author.get("email")), border=1)
            pdf.cell(40, 10, str(author.get("average_rating", 0.0)), border=1)
            pdf.cell(40, 10, str(author.get("total_ratings", 0)), border=1, ln=True)

        return pdf.output(dest='S').encode('latin-1')