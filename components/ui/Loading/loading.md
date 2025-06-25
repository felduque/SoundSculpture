## 🎯 **Componentes principales:**

### 1. **Loading básico**
```jsx
// Para botones pequeños
<Loading size="xs" />

// Para cards o secciones
<Loading size="md" text="Cargando datos..." />

// Para pantalla completa
<Loading size="full" fullScreen text="Iniciando aplicación..." />
```

### 2. **Variantes de animación**
```jsx
// Spinner nativo (por defecto)
<Loading variant="spinner" />

// Puntos animados
<Loading variant="dots" />

// Pulso suave
<Loading variant="pulse" />

// Skeleton loading
<Loading variant="skeleton" />
```

### 3. **Botón con loading integrado**
```jsx
const { isLoading, startLoading, stopLoading } = useLoading();

<LoadingButton 
  isLoading={isLoading}
  onPress={handleSubmit}
  loadingText="Enviando..."
  size="md"
>
  <Text className="text-white font-medium">Enviar</Text>
</LoadingButton>
```

### 4. **Overlay de pantalla completa**
```jsx
<LoadingOverlay 
  visible={isLoading}
  text="Procesando..."
  size="lg"
  variant="spinner"
/>
```

## 📏 **Tamaños disponibles:**
- `xs` - Para iconos pequeños (16px)
- `sm` - Para botones (20px)
- `md` - Para cards (24px)
- `lg` - Para secciones (32px)
- `xl` - Para pantallas (40px)
- `full` - Para splash screens (48px)

## 🎨 **Personalización:**
```jsx
<Loading 
  size="lg"
  variant="dots"
  color="#10b981"  // Verde de tu paleta
  text="Cargando productos..."
  className="my-4"
/>
```

## 🔧 **Hook incluido:**
```jsx
const MyComponent = () => {
  const { isLoading, startLoading, stopLoading } = useLoading();
  
  const fetchData = async () => {
    startLoading();
    try {
      await api.getData();
    } finally {
      stopLoading();
    }
  };
  
  return <Loading size="md" />;
};
```

### 5. **Formas**

```jsx
// Para pantalla de carga principal
<Loading 
  variant="sculpture" 
  size="xl" 
  color="#3b82f6"
  text="Generando escultura..."
/>

// Para botones de procesamiento
<Loading 
  variant="sculpture" 
  size="sm" 
  color="#10b981"
/>

// Para overlay cuando procesa audio
<LoadingOverlay 
  visible={isProcessing}
  variant="sculpture"
  size="lg"
  text="Transformando audio en escultura..."
  color="#8b5cf6"
/>
```

## 🎨 **Variaciones de color temáticas:**
```jsx
// Modo audio (azul)
<Loading variant="sculpture" color="#3b82f6" />

// Modo creativo (púrpura)
<Loading variant="sculpture" color="#8b5cf6" />

// Modo éxito (verde)
<Loading variant="sculpture" color="#10b981" />
```

