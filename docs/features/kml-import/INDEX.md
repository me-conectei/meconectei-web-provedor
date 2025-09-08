# Feature: Importação de Arquivos KMZ/KML

## 📚 Documentação Disponível

### 📖 [README.md](./README.md)
Documentação completa da feature incluindo:
- Visão geral e funcionalidades
- Como usar a feature
- Estrutura técnica
- Experiência do usuário
- Próximos passos

### 🏗️ [ARCHITECTURE.md](./ARCHITECTURE.md)
Documentação técnica da arquitetura:
- Fluxo de dados
- Componentes e responsabilidades
- Estrutura de dados
- Tratamento de erros
- Performance e otimização

## 🚀 Início Rápido

1. **Para usar a feature**: Vá para "Área de atuação" → "Criar uma área"
2. **Para entender o código**: Consulte ARCHITECTURE.md
3. **Para fazer modificações**: Leia README.md primeiro

## 📁 Arquivos Relacionados

### Componentes
- `src/components/KMLUploader/index.js` - Componente principal de upload
- `src/pages/maps/createArea/BasicMap.js` - Mapa com suporte a dados importados

### Páginas
- `src/pages/maps/createArea/index.js` - Página de criação com importação
- `src/pages/maps/area/index.js` - Página de edição (sem importação)

### Dependências
- `@mapbox/togeojson` - Conversão KML para GeoJSON
- `jszip` - Processamento de arquivos KMZ
- `xmldom` - Parsing de XML
- `react-dropzone` - Interface de upload
