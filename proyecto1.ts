class MaxHeap {
    private heap: any[];

    constructor() {
        this.heap = [];
    }

    insertar(orden: any) {
        this.heap.push(orden);
        this.subir(this.heap.length - 1);
    }

    extraerMaximo() {
        if (this.heap.length === 0) return null;
        if (this.heap.length === 1) return this.heap.pop();

        const max = this.heap[0];
        this.heap[0] = this.heap.pop()!;
        this.bajar(0);
        return max;
    }

    private subir(index: number) {
        let currentIndex = index;
        const currentElement = this.heap[currentIndex];

        while (currentIndex > 0) {
            const parentIndex = Math.floor((currentIndex - 1) / 2);
            const parentElement = this.heap[parentIndex];

            if (parentElement.precio >= currentElement.precio) break;

            this.heap[currentIndex] = parentElement;
            currentIndex = parentIndex;
        }
        this.heap[currentIndex] = currentElement;
    }

    private bajar(index: number) {
        let currentIndex = index;
        const currentElement = this.heap[currentIndex];
        const length = this.heap.length;

        while (true) {
            let leftChildIndex = 2 * currentIndex + 1;
            let rightChildIndex = 2 * currentIndex + 2;
            let largest = currentIndex;

            if (leftChildIndex < length && this.heap[leftChildIndex].precio > this.heap[largest].precio) {
                largest = leftChildIndex;
            }
            if (rightChildIndex < length && this.heap[rightChildIndex].precio > this.heap[largest].precio) {
                largest = rightChildIndex;
            }
            if (largest === currentIndex) break;

            this.heap[currentIndex] = this.heap[largest];
            currentIndex = largest;
        }
        this.heap[currentIndex] = currentElement;
    }

    mostrar() {
        console.log("📊 Órdenes de compra (MaxHeap):", this.heap);
    }
}

class MinHeap {
    private heap: any[];

    constructor() {
        this.heap = [];
    }

    insertar(orden: any) {
        this.heap.push(orden);
        this.subir(this.heap.length - 1);
    }

    extraerMinimo() {
        if (this.heap.length === 0) return null;
        if (this.heap.length === 1) return this.heap.pop();

        const min = this.heap[0];
        this.heap[0] = this.heap.pop()!;
        this.bajar(0);
        return min;
    }

    private subir(index: number) {
        let currentIndex = index;
        const currentElement = this.heap[currentIndex];

        while (currentIndex > 0) {
            const parentIndex = Math.floor((currentIndex - 1) / 2);
            const parentElement = this.heap[parentIndex];

            if (parentElement.precio <= currentElement.precio) break;

            this.heap[currentIndex] = parentElement;
            currentIndex = parentIndex;
        }
        this.heap[currentIndex] = currentElement;
    }

    private bajar(index: number) {
        let currentIndex = index;
        const currentElement = this.heap[currentIndex];
        const length = this.heap.length;

        while (true) {
            let leftChildIndex = 2 * currentIndex + 1;
            let rightChildIndex = 2 * currentIndex + 2;
            let smallest = currentIndex;

            if (leftChildIndex < length && this.heap[leftChildIndex].precio < this.heap[smallest].precio) {
                smallest = leftChildIndex;
            }
            if (rightChildIndex < length && this.heap[rightChildIndex].precio < this.heap[smallest].precio) {
                smallest = rightChildIndex;
            }
            if (smallest === currentIndex) break;

            this.heap[currentIndex] = this.heap[smallest];
            currentIndex = smallest;
        }
        this.heap[currentIndex] = currentElement;
    }

    mostrar() {
        console.log("📊 Órdenes de venta (MinHeap):", this.heap);
    }
}

class SimuladorMercado {
    private maxHeapCompras: MaxHeap;
    private minHeapVentas: MinHeap;
    private historial: any[];

    constructor() {
        this.maxHeapCompras = new MaxHeap();
        this.minHeapVentas = new MinHeap();
        this.historial = [];
    }

    // Mostrar bienvenida con las empresas
    mostrarEmpresas() {
        console.log("📢 Bienvenidos al Simulador de Mercado de Acciones.");
        console.log("Las siguientes empresas están ofreciendo sus acciones en este momento:");
        console.log("1. TechCorp - Líder en el sector tecnológico.");
        console.log("2. FinCo - Referente en el sector financiero.");
        console.log("--------------------------------------------------------");
    }

    // Procesar y emparejar órdenes de compra y venta
    procesarOrdenes() {
        console.log("⌛ Procesando órdenes...");
        while (true) {
            const compra = this.maxHeapCompras.extraerMaximo();
            const venta = this.minHeapVentas.extraerMinimo();

            if (!compra || !venta) break;
            if (compra.precio >= venta.precio) {
                const cantidadIntercambiada = Math.min(compra.cantidad, venta.cantidad);

                // Mostrar transacción mientras se procesa
                console.log(`💼 Emparejando: ${compra.comprador} comprando de ${venta.vendedor}`);
                console.log(`   🏢 Empresa: ${compra.compania}`);
                console.log(`   🔄 Acciones intercambiadas: ${cantidadIntercambiada}`);
                console.log(`   💵 Precio de compra: ${compra.precio} | Precio de venta: ${venta.precio}`);
                console.log("--------------------------------------------------------");

                // Agregar la transacción al historial
                this.historial.push({
                    compania: compra.compania,
                    cantidad: cantidadIntercambiada,
                    precio: venta.precio,
                    comprador: compra.comprador,
                    vendedor: venta.vendedor
                });

                compra.cantidad -= cantidadIntercambiada;
                venta.cantidad -= cantidadIntercambiada;

                // Reinsertar órdenes si hay remanentes
                if (compra.cantidad > 0) this.maxHeapCompras.insertar(compra);
                if (venta.cantidad > 0) this.minHeapVentas.insertar(venta);
            }
        }
    }

    // Insertar una orden de compra
    insertarCompra(orden: any) {
        this.maxHeapCompras.insertar(orden);
    }

    // Insertar una orden de venta
    insertarVenta(orden: any) {
        this.minHeapVentas.insertar(orden);
    }

    // Función para mostrar transacción de manera atractiva
    private formatearTransaccion(transaccion: any): string {
        return `💼 Transacción completada:
    🏢 Empresa: ${transaccion.compania}
    🔄 Acciones intercambiadas: ${transaccion.cantidad}
    💵 Precio por acción: $${transaccion.precio.toFixed(2)}
    👤 Comprador: ${transaccion.comprador}
    👤 Vendedor: ${transaccion.vendedor}
    -----------------------------------------------`;
    }

    // Mostrar el historial de transacciones
    mostrarHistorialBonito() {
        if (this.historial.length === 0) {
            console.log("🚫 No se han realizado transacciones aún.");
        } else {
            console.log("📈 Historial de Transacciones:");
            this.historial.forEach((transaccion, index) => {
                console.log(`${index + 1}️⃣ ${this.formatearTransaccion(transaccion)}`);
            });
        }
    }

    // Mostrar órdenes actuales
    mostrarOrdenes() {
        this.maxHeapCompras.mostrar();
        this.minHeapVentas.mostrar();
    }
}

// Simulación de uso
const simulador = new SimuladorMercado();
simulador.mostrarEmpresas();

// Ingresar algunas órdenes de compra y venta
simulador.insertarCompra({ compania: "TechCorp", cantidad: 100, precio: 55, comprador: "Carlos" });
simulador.insertarVenta({ compania: "TechCorp", cantidad: 100, precio: 50, vendedor: "Sofía" });
simulador.insertarCompra({ compania: "FinCo", cantidad: 200, precio: 75, comprador: "Carlos" });
simulador.insertarVenta({ compania: "FinCo", cantidad: 150, precio: 70, vendedor: "Sofía" });

// Mostrar órdenes antes de procesar
simulador.mostrarOrdenes();

// Procesar las órdenes
simulador.procesarOrdenes();

// Mostrar el historial
simulador.mostrarHistorialBonito();
