import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as SolidCoreModuleExports from '@solidxai/core';
import { DatasourceType, getDynamicModuleNames, ISolidDatabaseModule, parseBooleanEnv, SolidDatabaseModule } from '@solidxai/core';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { join } from 'path';
import { getMetadataArgsStorage } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { Logger } from 'winston';
import { WinstonTypeORMLogger } from '@solidxai/core';

function getEntitiesFromExports(exports: Record<string, any>) {
    const metadataStorage = getMetadataArgsStorage();
    return Object.values(exports).filter((item) =>
        metadataStorage.tables.some((table) => table.target === item)
    );
}
const coreEntities = getEntitiesFromExports(SolidCoreModuleExports);

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useFactory: (logger: Logger) => {
                const dynamicModules = getDynamicModuleNames();

                const entities = [
                    ...coreEntities,
                    ...dynamicModules.map(module =>
                        join(__dirname, `./${module}/entities/*.entity.{ts,js}`)
                    ),
                ];

                const baseConfig = {
                    type: 'postgres' as const,
                    entities: entities,
                    synchronize: parseBooleanEnv('DEFAULT_DATABASE_SYNCHRONIZE'),
                    logging: parseBooleanEnv('DEFAULT_DATABASE_LOGGING'),
                    logger: parseBooleanEnv('DEFAULT_DATABASE_LOGGING') ? new WinstonTypeORMLogger(logger) : undefined,
                    namingStrategy: new SnakeNamingStrategy(),
                    maxQueryExecutionTime: 500,
                    ssl: {
                        rejectUnauthorized: false,
                    },
                    extra: {
                        ssl: {
                            rejectUnauthorized: false,
                        },
                        max: Number(process.env.DEFAULT_DATABASE_POOL_MAX ?? 20),
                        connectionTimeoutMillis: 30000,
                        idleTimeoutMillis: 30000,
                        statement_timeout: 15000,
                        idle_in_transaction_session_timeout: 60000,
                    },
                    retryAttempts: Number(process.env.DEFAULT_DATABASE_RETRY_ATTEMPTS ?? 5),
                    retryDelay: Number(process.env.DEFAULT_DATABASE_RETRY_DELAY_MS ?? 5000),
                };

                if (process.env.DATABASE_URL) {
                    return {
                        ...baseConfig,
                        url: process.env.DATABASE_URL,
                        ssl: {
                            rejectUnauthorized: false,
                        } as any,
                    };
                }

                return {
                    ...baseConfig,
                    host: process.env.DEFAULT_DATABASE_HOST,
                    port: +process.env.DEFAULT_DATABASE_PORT,
                    username: process.env.DEFAULT_DATABASE_USER,
                    password: process.env.DEFAULT_DATABASE_PASSWORD,
                    database: process.env.DEFAULT_DATABASE_NAME,
                };
            },
            inject: [WINSTON_MODULE_PROVIDER]
        }),
    ],
})
@SolidDatabaseModule()
export class DefaultDBModule implements ISolidDatabaseModule {
    type(): DatasourceType {
        return DatasourceType.postgres;
    }

    name(): string {
        return 'default';
    }
}