redis.call('del', '{demo-app}some.key')
redis.call('srem', '{demo-app}some.set', 'value')
redis.call('sadd', '{demo-app}some.set', 'new value')
