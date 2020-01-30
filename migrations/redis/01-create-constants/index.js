
async function createConstantKeys(service) {
  const { redis } = service
  const pipeline = redis.pipeline()
  pipeline.set('some.key')
  pipeline.sadd('some.set', 'value')
  pipeline.sadd('some.set', 'other value')

  await pipeline.exec()
}

module.exports = {
  min: 0,
  final: 1,
  script: createConstantKeys,
}
