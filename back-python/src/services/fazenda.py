#FEITO

from config import *
from models.fazenda import Fazenda

def criar_fazenda(data):
    fazenda = Fazenda(
        nome=data['nome'],
        tipo=data['tipo'],
        ano_fundacao=data['ano_fundacao'],
        nome_fazendeiro=data['nome_fazendeiro'],
        morcegos_frutiferos=data['morcegos_frutiferos']
    )
    
    db.session.add(fazenda)
    db.session.commit()
    
    return fazenda

def retornar_fazendas():
    fazendas = Fazenda.query.all()
    
    return fazendas
