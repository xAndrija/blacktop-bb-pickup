self.addEventListener('push', function (event) {
  const data = event.data?.json() ?? {}
  event.waitUntil(
    self.registration.showNotification(data.title ?? 'BLKTOP 🏀', {
      body: data.body ?? '',
      icon: '/logo.svg',
      badge: '/logo.svg',
      data: { url: data.url ?? '/' },
      vibrate: [200, 100, 200],
    })
  )
})

self.addEventListener('notificationclick', function (event) {
  event.notification.close()
  const url = event.notification.data?.url ?? '/'
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
      for (const client of clientList) {
        if (client.url === url && 'focus' in client) return client.focus()
      }
      if (clients.openWindow) return clients.openWindow(url)
    })
  )
})
