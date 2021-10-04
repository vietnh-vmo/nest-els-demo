import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { envConfig } from '@helper/env.helpers';

@Module({
  imports: [
    ElasticsearchModule.registerAsync({
      useFactory: async () => ({
        node: envConfig.ES_URL,
        maxRetries: 10,
        requestTimeout: 60000,
        pingTimeout: 60000,
        sniffOnStart: true,
      }),
    }),
  ],
  providers: [SearchService],
  exports: [SearchService],
})
export class SearchModule {}
