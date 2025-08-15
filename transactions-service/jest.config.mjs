// jest.config.mjs
export default {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  transform: {
    // Garante que arquivos .js sejam processados pelo babel-jest
    '^.+\\.js$': 'babel-jest',
  },
  testMatch: [
    '**/__tests__/**/*.js',
    '**/?(*.)+(spec|test).js'
  ],
  // Isso desabilita a ignorância de transformação para arquivos específicos
  // Se for o caso, pode ser necessário ajustar para não ignorar o seu serviço
  transformIgnorePatterns: [
    'node_modules/(?!(your-module-name-if-any)/)',
  ],
};