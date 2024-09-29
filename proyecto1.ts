class MaxHeap {
    private heap: any[];
    private size: number;

    constructor() {
        this.heap = [];
        this.size = 0;
    }

    agregarOrden(orden: any) {
        this.heap[this.size] = orden;  // Asigna el nuevo elemento en el índice "size"
        this.size++;
        this.subirElemento(this.size - 1);
    }

    removerMaximo() {
        if (this.size === 0) return null;
        if (this.size === 1) {
            this.size--;
            return this.heap.pop();
        }

        const max = this.heap[0];
        this.heap[0] = this.heap[this.size - 1];
        this.size--;
        this.bajarElemento(0);
        return max;
    }

    private subirElemento(index: number) {
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

    private bajarElemento(index: number) {
        let currentIndex = index;
        const currentElement = this.heap[currentIndex];
        const length = this.size;

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

    visualizar() {
        console.log("📊 Órdenes de compra (MaxHeap):", this.heap.slice(0, this.size));
    }
}

class MinHeap {
    private heap: any[];
    private size: number;

    constructor() {
        this.heap = [];
        this.size = 0;
    }

    agregarOrden(orden: any) {
        this.heap[this.size] = orden;  // Asigna el nuevo elemento en el índice "size"
        this.size++;
        this.subirElemento(this.size - 1);
    }

    removerMinimo() {
        if (this.size === 0) return null;
        if (this.size === 1) {
            this.size--;
            return this.heap.pop();
        }

        const min = this.heap[0];
        this.heap[0] = this.heap[this.size - 1];
        this.size--;
        this.bajarElemento(0);
        return min;
    }

    private subirElemento(index: number) {
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

    private bajarElemento(index: number) {
        let currentIndex = index;
        const currentElement = this.heap[currentIndex];
        const length = this.size;

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

    visualizar() {
        console.log("📊 Órdenes de venta (MinHeap):", this.heap.slice(0, this.size));
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

    mostrarEmpresas() {
        console.log("📢 Bienvenidos al Simulador de Mercado de Acciones.");
        console.log("Las siguientes empresas están ofreciendo sus acciones en este momento:");
        console.log("1. Apple - Líder en el sector tecnológico.");
        console.log("2. Microsoft - Referente en el sector de software.");
        console.log("--------------------------------------------------------");
    }

    procesarOrdenes() {
        console.log("⌛ Procesando órdenes...");
        while (true) {
            const compra = this.maxHeapCompras.removerMaximo();
            const venta = this.minHeapVentas.removerMinimo();

            if (!compra || !venta) break;
            if (compra.precio >= venta.precio) {
                const cantidadIntercambiada = Math.min(compra.cantidad, venta.cantidad);

                console.log(`💼 Emparejando: ${compra.comprador} comprando de ${venta.vendedor}`);
                console.log(`   🏢 Empresa: ${compra.compania}`);
                console.log(`   🔄 Acciones intercambiadas: ${cantidadIntercambiada}`);
                console.log(`   💵 Precio de compra: ${compra.precio} | Precio de venta: ${venta.precio}`);
                console.log("--------------------------------------------------------");

                this.historial.push({
                    compania: compra.compania,
                    cantidad: cantidadIntercambiada,
                    precio: venta.precio,
                    comprador: compra.comprador,
                    vendedor: venta.vendedor
                });

                compra.cantidad -= cantidadIntercambiada;
                venta.cantidad -= cantidadIntercambiada;

                if (compra.cantidad > 0) this.maxHeapCompras.agregarOrden(compra);
                if (venta.cantidad > 0) this.minHeapVentas.agregarOrden(venta);
            }
        }
    }

    agregarCompra(orden: any) {
        this.maxHeapCompras.agregarOrden(orden);
    }

    agregarVenta(orden: any) {
        this.minHeapVentas.agregarOrden(orden);
    }

    private formatearTransaccion(transaccion: any): string {
        return `💼 Transacción completada:
    🏢 Empresa: ${transaccion.compania}
    🔄 Acciones intercambiadas: ${transaccion.cantidad}
    💵 Precio por acción: $${transaccion.precio.toFixed(2)}
    👤 Comprador: ${transaccion.comprador}
    👤 Vendedor: ${transaccion.vendedor}
    -----------------------------------------------`;
    }

    mostrarHistorialDeTransacciones() {
        if (this.historial.length === 0) {
            console.log("🚫 No se han realizado transacciones aún.");
        } else {
            console.log("📈 Historial de Transacciones:");
            this.historial.forEach((transaccion, index) => {
                console.log(`${index + 1}️⃣ ${this.formatearTransaccion(transaccion)}`);
            });
        }
    }

    mostrarOrdenes() {
        this.maxHeapCompras.visualizar();
        this.minHeapVentas.visualizar();
    }
}

// Simulación de uso
const simulador = new SimuladorMercado();
simulador.mostrarEmpresas();

simulador.agregarCompra({ compania: "Apple", cantidad: 100, precio: 150, comprador: "Carlos" });
simulador.agregarVenta({ compania: "Apple", cantidad: 100, precio: 50, vendedor: "Sofía" });
simulador.agregarCompra({ compania: "Microsoft", cantidad: 200, precio: 75, comprador: "Carlos" });
simulador.agregarVenta({ compania: "Microsoft", cantidad: 150, precio: 70, vendedor: "Sofía" });

simulador.mostrarOrdenes();

simulador.procesarOrdenes();

simulador.mostrarHistorialDeTransacciones();
