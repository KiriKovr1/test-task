import { ConfigurableModuleBuilder } from '@nestjs/common'

export type TConfigOptions = {
    fileName: string
}

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
    new ConfigurableModuleBuilder<TConfigOptions>()
        .setExtras(
            {
                isGlobal: true,
            },
            (definition, extras) => ({
                ...definition,
                global: extras.isGlobal,
            }),
        )
        .setClassMethodName('forRoot')
        .build()
