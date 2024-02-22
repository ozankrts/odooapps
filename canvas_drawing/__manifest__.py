# -*- coding: utf-8 -*-
{
    'name': "Canvas",

    'summary': """
       Canvas Drawing""",
    'description': """
        Canvas Drawing
    """,
    'author': "Ozan",
    'website': "", 
    'category': 'Tools',
    'version': '15.0.1',
    'sequence': -10,
    'maintainer':'Ozan',
    'price':'20.0',
    'currency':'USD',
    'depends': ['base','sale'],
    "license": "LGPL-3",
    'data': [
        'security/ir.model.access.csv',
        'views/canvas_views.xml',  
    ],
    'assets': {
        'web.assets_backend': [
            'canvas_drawing/static/src/js/canvas_script.js',
        ],
        'web.assets_qweb': [
            'canvas_drawing/static/src/xml/*.xml',
            'canvas_drawing/static/src/xml/canvas_template.xml',
        ],
        'web.assets_frontend': [
            'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css',
        ],
    },
    "images":['canvas_drawing/static/description/banner.gif'],
    "application": True,
    "installable": True,
}
