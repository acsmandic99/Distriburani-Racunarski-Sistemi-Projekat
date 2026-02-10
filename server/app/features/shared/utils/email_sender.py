from multiprocessing import Process
from flask import current_app
from ...email.services import ContactService

def launch_email_process(email, subject, text):
    """
    Slanje emaila u zasebnom folderu
    """
    token = current_app.config.get("TOKEN")
    inbox_id = current_app.config.get("INBOX_ID")
    print(f"TOKEN: {token}\nINBOX_ID {inbox_id}\nemail: {email}\nsubject {subject},\n{text}")
    p = Process(
        target=ContactService.send_email_logic,
        args=(email, subject, text, token, inbox_id)
    )
    p.start() 