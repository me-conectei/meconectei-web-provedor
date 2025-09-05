# Feature de Importação de Arquivos KMZ/KML

## Visão Geral

Esta feature permite a importação e visualização de arquivos KMZ e KML no sistema de mapas. Os usuários podem fazer upload de arquivos geográficos e visualizar os dados diretamente no mapa interativo.

## Funcionalidades Implementadas

### 1. Upload de Arquivos
- **Drag & Drop**: Interface intuitiva para arrastar e soltar arquivos
- **Seleção Manual**: Botão para selecionar arquivos do sistema
- **Formatos Suportados**: 
  - `.kml` (Keyhole Markup Language)
  - `.kmz` (Keyhole Markup Language Zipped)

### 2. Processamento de Arquivos
- **Parser KML**: Converte arquivos KML para formato GeoJSON
- **Parser KMZ**: Extrai e processa arquivos KML de dentro de arquivos KMZ
- **Validação**: Verifica se os arquivos são válidos antes do processamento
- **Tratamento de Erros**: Mensagens claras em caso de problemas

### 3. Visualização no Mapa
- **Pontos**: Marcadores azuis para pontos geográficos
- **Linhas**: Linhas laranjas para caminhos/rotas
- **Polígonos**: Áreas verdes para regiões/territórios
- **Multi-Polígonos**: Suporte para áreas complexas

### 4. Interface do Usuário
- **Feedback Visual**: Indicadores de progresso durante o upload
- **Informações Detalhadas**: Contagem de elementos por tipo
- **Controles**: Botões para limpar dados importados
- **Notificações**: Toast messages para sucesso/erro

## Como Usar

### 1. Acessar a Página de Mapas
- Navegue até a página de configuração de área
- A seção de importação aparece acima do mapa

### 2. Fazer Upload do Arquivo
- **Opção 1**: Arraste o arquivo KMZ/KML para a área de drop
- **Opção 2**: Clique na área para abrir o seletor de arquivos
- Aguarde o processamento (indicador de progresso)

### 3. Visualizar os Dados
- Os elementos aparecerão automaticamente no mapa
- Diferentes cores para diferentes tipos de geometria
- Informações detalhadas sobre o arquivo processado

### 4. Gerenciar Dados Importados
- Use o botão "Limpar Importados" para remover os dados
- Os dados importados são independentes das coordenadas manuais

## Estrutura Técnica

### Componentes Criados
- `KMLUploader`: Componente principal de upload
- Integração com `BasicMap` para visualização
- Parser usando `@mapbox/togeojson`

### Dependências Adicionadas
- `@mapbox/togeojson`: Conversão KML para GeoJSON
- `jszip`: Processamento de arquivos KMZ
- `xmldom`: Parsing de XML

### Arquivos Modificados
- `src/components/KMLUploader/index.js`: Novo componente
- `src/pages/maps/area/Maps.js`: Renderização de dados importados
- `src/pages/maps/area/index.js`: Integração da feature

## Experiência do Usuário

### Fluxo de Uso
1. **Upload**: Interface simples e intuitiva
2. **Processamento**: Feedback visual durante o carregamento
3. **Visualização**: Dados aparecem imediatamente no mapa
4. **Gerenciamento**: Controles fáceis para limpar dados

### Design Responsivo
- Interface adaptável para diferentes tamanhos de tela
- Componentes Material-UI para consistência visual
- Cores diferenciadas para cada tipo de geometria

### Tratamento de Erros
- Validação de formato de arquivo
- Mensagens de erro claras e específicas
- Fallback gracioso em caso de problemas

## Próximos Passos

### Funcionalidades Futuras
- **Salvamento**: Persistir dados importados no backend
- **Edição**: Permitir modificação de elementos importados
- **Exportação**: Salvar dados modificados como KML/KMZ
- **Camadas**: Sistema de camadas para organizar dados
- **Filtros**: Filtrar elementos por tipo ou propriedades

### Melhorias Técnicas
- **Performance**: Otimização para arquivos grandes
- **Cache**: Cache de dados processados
- **Validação**: Validação mais robusta de geometrias
- **Compressão**: Suporte a arquivos KMZ com múltiplos arquivos

## Considerações de Segurança

- Validação de tipos de arquivo
- Limitação de tamanho de arquivo
- Sanitização de dados XML
- Tratamento seguro de arquivos ZIP

## Compatibilidade

- **Navegadores**: Chrome, Firefox, Safari, Edge (versões modernas)
- **Formatos**: KML 2.2, KMZ (ZIP com KML)
- **Geometrias**: Point, LineString, Polygon, MultiPolygon
- **Sistemas**: Windows, macOS, Linux
