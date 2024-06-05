export const ReminderAlert = async() => {
    const registration = await navigator.serviceWorker.ready;
    await registration.periodicSync.register({
        tag: 'sync-content',
        minInterval: 60000 // runs every day
    });
}