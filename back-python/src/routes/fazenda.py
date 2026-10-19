from config import *
from models.fazenda import Fazenda
import services.pessoa as fazenda_service

@app.route('/fazendas', methods=['GET'])
def retornar_fazendas():
    fazendas = fazenda_service.retornar_fazenda()
    
    return jsonify({
        "resultado":"ok",
        "detalhes":[fazenda.json() for fazenda in fazendas]
    })

@app.route('/fazenda', methods=['POST'])
@jwt_required()
def criar_pessoa():
    dados = request.json
    
    if not dados or not dados.get('nome') or not dados.get('tipo') or not dados.get('ano_fundacao') or not dados.get('nome_fazendeiro') or not dados.get('morcegos_frutiferos'):
        return jsonify({"resultado":"erro", "detalhes":"Nome, tipo, ano de fundação, nome do fazendeiro e presença de morcegos frutíferos são obrigatórios"}), 400
    
    fazenda = fazenda_service.criar_fazenda(dados)    
    
    return jsonify({
        "resultado":"ok", 
        "detalhes":fazenda.json()
    }), 201

