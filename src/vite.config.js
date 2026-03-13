import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react()],
})
```

---

Bu 4 dosyayı oluşturduktan sonra repository şöyle görünmeli:
```
neurofen/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── App.jsx
    └── main.jsx
