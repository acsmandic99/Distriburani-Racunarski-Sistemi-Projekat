import mailtrap as mt

class ContactService:
    @staticmethod
    def send_email_logic(email, subject, text, token, inbox_id):
        try:
            mail = mt.Mail(
            sender=mt.Address(email="hello@recepti.com", name="Mailtrap Test"),
            to=[mt.Address(email=email)],
            subject=subject,
            text=text,
            category="Notification",
            )

            client = mt.MailtrapClient(token="edf74c48687fe68549e15187a8a05e7a", sandbox=True, inbox_id=4236067)
            response = client.send(mail)

            print(response)
            
            print(f"Email poslat: {response}")
            return True
        except Exception as e:
            print(f"[PROCESS] Greška: {str(e)}")
            return False