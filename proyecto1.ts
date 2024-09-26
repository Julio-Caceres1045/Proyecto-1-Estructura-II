// Clase Orden
class Orden {
    constructor(
        public tipo: "compra" | "venta",
        public compania: string,
        public cantidad: number,
        public precio: number,
        public usuario: string
    ) {}
}

// Clase Montículo (Max-Heap para compra, Min-Heap para venta)
class Monticulo<T> {
    private monticulo: T[] = [];

    constructor(private comparar: (a: T, b: T) => number) {}

    agregar(orden: T) {
        this.monticulo.push(orden);
        this.subir(this.monticulo.length - 1);
    }

    extraer(): T | undefined {
        if (this.monticulo.length === 1) return this.monticulo.pop();
        const raiz = this.monticulo[0];
        this.monticulo[0] = this.monticulo.pop()!;
        this.bajar(0);
        return raiz;
    }

    private subir(index: number) {
        let padre = Math.floor((index - 1) / 2);
        if (index <= 0 || this.comparar(this.monticulo[padre], this.monticulo[index]) >= 0) return;
        [this.monticulo[padre], this.monticulo[index]] = [this.monticulo[index], this.monticulo[padre]];
        this.subir(padre);
    }

    private bajar(index: number) {
        let left = 2 * index + 1;
        let right = 2 * index + 2;
        let mayor = index;

        if (left < this.monticulo.length && this.comparar(this.monticulo[left], this.monticulo[mayor]) > 0) {
            mayor = left;
        }
        if (right < this.monticulo.length && this.comparar(this.monticulo[right], this.monticulo[mayor]) > 0) {
            mayor = right;
        }
        if (mayor !== index) {
            [this.monticulo[mayor], this.monticulo[index]] = [this.monticulo[index], this.monticulo[mayor]];
            this.bajar(mayor);
        }
    }

    esVacio(): boolean {
        return this.monticulo.length === 0;
    }

    peek(): T | undefined {
        return this.monticulo[0];
    }
}

// Clase Mercado para gestionar las órdenes y transacciones
class Mercado {
    private comprasPorCompania: { [key: string]: Monticulo<Orden> } = {};
    private ventasPorCompania: { [key: string]: Monticulo<Orden> } = {};
    private historial: any[] = [];

    private obtenerMonticuloDeCompras(compania: string) {
        if (!this.comprasPorCompania[compania]) {
            // Max-Heap para órdenes de compra (mayor precio primero)
            this.comprasPorCompania[compania] = new Monticulo<Orden>((a, b) => b.precio - a.precio);
        }
        return this.comprasPorCompania[compania];
    }

    private obtenerMonticuloDeVentas(compania: string) {
        if (!this.ventasPorCompania[compania]) {
            // Min-Heap para órdenes de venta (menor precio primero)
            this.ventasPorCompania[compania] = new Monticulo<Orden>((a, b) => a.precio - b.precio);
        }
        return this.ventasPorCompania[compania];
    }

    enviarOrden(orden: Orden) {
        if (orden.tipo === "compra") {
            this.obtenerMonticuloDeCompras(orden.compania).agregar(orden);
        } else {
            this.obtenerMonticuloDeVentas(orden.compania).agregar(orden);
        }
        this.emparejar(orden.compania);
    }

    private emparejar(compania: string) {
        const compras = this.obtenerMonticuloDeCompras(compania);
        const ventas = this.obtenerMonticuloDeVentas(compania);

        while (!compras.esVacio() && !ventas.esVacio()) {
            const mejorCompra = compras.peek()!;
            const mejorVenta = ventas.peek()!;

            // Verificamos si se puede realizar la transacción (precio de compra >= precio de venta)
            if (mejorCompra.precio >= mejorVenta.precio) {
                const cantidadTransaccion = Math.min(mejorCompra.cantidad, mejorVenta.cantidad);
                const precioTransaccion = mejorVenta.precio;

                this.registrarTransaccion(mejorCompra, mejorVenta, cantidadTransaccion, precioTransaccion);

                // Reducir la cantidad de las órdenes o eliminarlas si se completaron
                if (mejorCompra.cantidad > cantidadTransaccion) {
                    mejorCompra.cantidad -= cantidadTransaccion;
                } else {
                    compras.extraer();
                }

                if (mejorVenta.cantidad > cantidadTransaccion) {
                    mejorVenta.cantidad -= cantidadTransaccion;
                } else {
                    ventas.extraer();
                }
            } else {
                // Si no se pueden emparejar, salimos del bucle
                break;
            }
        }
    }

    private registrarTransaccion(compra: Orden, venta: Orden, cantidad: number, precio: number) {
        const transaccion = {
            compania: compra.compania,
            cantidad,
            precio,
            comprador: compra.usuario,
            vendedor: venta.usuario
        };
        this.historial.push(transaccion);
        console.log(this.formatearTransaccion(transaccion));
    }

    obtenerHistorial() {
        return this.historial;
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


    
    mostrarEmpresas() {
        console.log("Bienvenido a mi proyecto.");
        console.log("Simulador de un Mercado de Acciones.");
        console.log("Las siguientes empresas están ofreciendo sus acciones en este momento:");
        console.log("1. TechCorp - Líder en el sector tecnológico.");
        console.log("2. FinCo - Referente en el sector financiero.");
        console.log("--------------------------------------------------------");
    }

}


const mercado = new Mercado();

// Mostrar las empresas antes de las transacciones
mercado.mostrarEmpresas();

// Órdenes de compra y venta para las dos empresas
const comprador = "Carlos";
const vendedor = "Sofía";

// TechCorp
mercado.enviarOrden(new Orden("compra", "TechCorp", 150, 60, comprador));
mercado.enviarOrden(new Orden("venta", "TechCorp", 100, 55, vendedor));
mercado.enviarOrden(new Orden("venta", "TechCorp", 70, 58, vendedor));
mercado.enviarOrden(new Orden("compra", "TechCorp", 80, 56, comprador));
mercado.enviarOrden(new Orden("venta", "TechCorp", 50, 62, vendedor));
mercado.enviarOrden(new Orden("compra", "TechCorp", 120, 65, comprador));

// FinCo
mercado.enviarOrden(new Orden("venta", "FinCo", 200, 75, vendedor));
mercado.enviarOrden(new Orden("compra", "FinCo", 100, 80, comprador));
mercado.enviarOrden(new Orden("venta", "FinCo", 100, 70, vendedor));
mercado.enviarOrden(new Orden("compra", "FinCo", 90, 90, comprador));

// Mostrar el historial de transacciones
mercado.mostrarHistorialBonito();
