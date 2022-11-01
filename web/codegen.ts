import { CodegenConfig } from '@graphql-codegen/cli'
 
const config: CodegenConfig = {
  schema: 'http://localhost:5000/graphql',
  documents: ['./graphql/schema/**/*.graphql'],
  ignoreNoDocuments: true, // for better experience with the watcher
  generates: {
    './graphql/generated/': {
      preset: 'client',
      plugins: []
    }
  }
}
 
export default config