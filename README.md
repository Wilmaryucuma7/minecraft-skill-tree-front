# Minecraft Skill Tree Front

[![Deploy Status](https://img.shields.io/badge/Deploy-Live%20on%20AWS%20Amplify-success?logo=amazonaws&logoColor=white)](https://main.d2rnw81nncbps6.amplifyapp.com)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-18.3-61dafb?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.3-646CFF?logo=vite&logoColor=white)
![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2.2-764ABC?logo=redux&logoColor=white)

Interfaz web que visualiza un árbol de logros/skills inspirado en Minecraft. Consume un JSON con una jerarquía de logros, lo normaliza y permite marcar progreso con reglas simples de dependencias.

## Características principales
- Visualización jerárquica con posicionamiento automático.
- Estados de cada nodo (bloqueado, disponible, completado).
- Líneas SVG para relaciones padre → hijo.
- Tooltips contextuales.
- Configuración mediante variable de entorno (`VITE_SKILL_TREE_URL`).

## Tecnologías
React · TypeScript · Redux Toolkit · Vite · CSS Modules.

## Ejecutar localmente
```bash
npm install
npm start
```


## Variable de entorno opcional
Crear un archivo `.env` en la raíz:
```env
VITE_SKILL_TREE_URL=https://tu-servidor.com/mi-arbol.json
```

## Scripts útiles
```bash
npm start      # Desarrollo
npm run build  # Build producción (dist/)
npm run preview# Previsualizar build
npm run lint   # Linter
npm run format # Formateo
```

## Despliegue (ejemplos)
- AWS Amplify (archivo `amplify.yml` ya incluido)
- Vercel / Netlify (build estático tras `npm run build`)
- Cualquier hosting de contenido estático apuntando a `dist/`.

## Estructura básica
La organización prioriza separación entre lógica pura, estado y presentación.

```
src/
  Components/
    SkillTree/
      SkillTree.tsx          # Componente principal: orquesta hooks y render.
      AchievementNode.tsx    # Nodo individual (tooltip, click, hover).
      AchievementNodes.tsx   # Capa que posiciona todos los nodos.
      ConnectionLines.tsx    # Renderiza líneas SVG entre nodos.
      TreeStates.tsx         # Estados de carga / error / vacío.
      *.module.css           # Estilos modulares de esta feature visual.

  features/
    achievements/
      achievements.slice.ts  # Lógica de estado (Redux Toolkit slice + async thunk).
      achievements.selectors.ts # Selectores memorizados.

  hooks/
    useSkillTreeData.ts      # Carga inicial (fetch + normalización).
    useAchievementsData.ts   # Acceso tipado a partes del estado.
    useTreeLayout.ts         # Calcula posiciones (x,y) y dimensiones del árbol.
    useConnectionLines.ts    # Genera geometría + estados visuales de las líneas.
    useTreeInteraction.ts    # Maneja hover / interacción efímera.

  utils/
    treeLayout.utils.ts      # Algoritmo de layout (centra padres, posiciona hojas).
    lineGeometry.utils.ts    # Cálculo de puntos intermedios para cada línea.
    lineState.utils.ts       # Determina estado visual de una línea.
    svgPath.utils.ts         # Construcción de path SVG.
    tooltipPosition.utils.ts # Lógica de posicionamiento seguro del tooltip.
    dataTransform.utils.ts   # Normalización de árbol crudo a estructura plana.

  constants/                 # Dimensiones, offsets, padding, etc.
  types/                     # Tipos compartidos (logros, layout, líneas).
  store.ts                   # Configuración del store de Redux.
  config.ts                  # Variables de configuración (URL de datos).
  App.tsx                    # Contenedor de alto nivel.
  main.tsx                   # Punto de entrada (montaje React + Provider estado).
```

### Flujo resumido
1. `useSkillTreeData` dispara fetch y normaliza.
2. El slice almacena mapa plano (`achievements`) + `rootId`.
3. `useTreeLayout` produce coordenadas y dimensiones.
4. `useConnectionLines` deriva líneas y estados visuales.
5. Interacción (hover / click) actualiza estado y estilos.

## Formato de datos esperado
El backend (o archivo estático) debe devolver un objeto raíz que represente el primer logro. Cada nodo puede contener un arreglo `children` (anidado recursivamente). No se requieren IDs externos: se generan internamente.

Campos obligatorios por nodo:
- `name`: string — título corto.
- `description`: string — texto descriptivo.
- `image`: string — URL absoluta o ruta relativa a una imagen.
- `children`: array de nodos hijo (puede ser vacío).

Ejemplo completo:
```json
{
  "name": "Root Achievement",
  "description": "Logro raíz del árbol.",
  "image": "/images/root.png",
  "children": [
    {
      "name": "Branch A",
      "description": "Primer sub-logro.
", "image": "/images/a.png", "children": [] },
    {
      "name": "Branch B",
      "description": "Segundo sub-logro.",
      "image": "/images/b.png",
      "children": [
        {
          "name": "Leaf B1",
          "description": "Hoja dependiente de Branch B.",
          "image": "/images/b1.png",
          "children": []
        }
      ]
    }
  ]
}
