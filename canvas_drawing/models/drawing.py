from odoo import models, fields, api, _
from odoo.exceptions import UserError
from datetime import datetime
import html2text
import base64
import io
from PyPDF2 import  PdfFileReader, PdfFileWriter
import logging

_logger = logging.getLogger(__name__)

class Drawing(models.Model):
    _name = 'drawing'
    _description = 'Drawing'
    _inherit = 'mail.thread'

    name = fields.Char(
        string='Name',   
    )
    image = fields.Binary(
        string='Drawing Image',
    )

   

    def create_drawing(self, drawId, drawName, base64):
        draw_id = self.env['drawing'].search([('id', '=', int(drawId))], limit=1)
        if draw_id:
            drawing_data = self.env['ir.attachment'].create({
                "name": drawName,
                "datas": base64,
                "res_model": "drawing",
                "res_id": draw_id.id,
                "res_name": drawName,
            })
            draw_id.update({
                "image":base64
            })

        return draw_id.id