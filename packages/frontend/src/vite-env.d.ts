/// <reference types="vite/client" />

interface Pacifica {
    readonly VITE_API_URL: string;
    
}


interface ImportMeta {
  readonly env: Pacifica;
}