#FEITO

from config import *

class Fazenda(db.Model): 
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(200), nullable=False)
    tipo = db.Column(db.String(200), nullable=False)
    ano_fundacao = db.Column(db.Integer, nullable=False)
    nome_fazendeiro = db.Column(db.String(200), nullable=False)
    morcegos_frutiferos = db.Column(db.Boolean, nullable=False)

    def json(self):
        return {
            "id":self.id,
            "nome":self.nome,
            "tipo":self.tipo,
            "ano_fundacao":self.ano_fundacao,
            "nome_fazendeiro":self.nome_fazendeiro,
            "morcegos_frutiferos":self.morcegos_frutiferos
            }
