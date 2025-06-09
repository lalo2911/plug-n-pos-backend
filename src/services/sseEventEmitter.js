import { EventEmitter } from 'events';

// Singleton para manejar eventos SSE
class SSEEventEmitter extends EventEmitter {
    constructor() {
        super();
        this.clients = new Map(); // Map<clientId, { res, userId, businessId }>
    }

    // Agregar cliente SSE
    addClient(clientId, res, userId, businessId) {
        this.clients.set(clientId, { res, userId, businessId });

        // Cleanup cuando el cliente se desconecta
        res.on('close', () => {
            this.removeClient(clientId);
        });
    }

    // Remover cliente SSE
    removeClient(clientId) {
        this.clients.delete(clientId);
    }

    // Emitir evento de cambio de workday
    emitWorkdayChange(businessId, targetUserId = null, workdayData) {
        const event = {
            type: 'workday_change',
            businessId,
            userId: targetUserId,
            data: workdayData,
            timestamp: new Date().toISOString()
        };

        // Enviar a clientes específicos según el alcance del cambio
        for (const [clientId, client] of this.clients.entries()) {
            try {
                // Comparar como string para evitar errores de tipo
                const sameBusiness = client.businessId?.toString() === businessId?.toString();
                const isGeneralChange = targetUserId == null;
                const isForThisClient = client.userId?.toString() === targetUserId?.toString();
                const shouldSendToClient = sameBusiness && (isGeneralChange || isForThisClient);

                if (!sameBusiness) continue;

                if (shouldSendToClient) {
                    client.res.write(`data: ${JSON.stringify(event)}\n\n`);
                } else {
                }
            } catch (error) {
                this.removeClient(clientId);
            }
        }
    }

    // Obtener estadísticas de conexiones
    getStats() {
        const businessStats = {};
        for (const client of this.clients.values()) {
            if (!businessStats[client.businessId]) {
                businessStats[client.businessId] = 0;
            }
            businessStats[client.businessId]++;
        }
        return {
            totalClients: this.clients.size,
            businessStats
        };
    }
}

// Exportar instancia singleton
export const sseEventEmitter = new SSEEventEmitter();