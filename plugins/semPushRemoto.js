// A conta gratuita da Apple (Personal Team) não assina apps com push remoto.
// O expo-notifications liga essa capacidade por padrão; o UniRide só usa notificação local, então ela sai.
const { withEntitlementsPlist } = require("expo/config-plugins");

module.exports = (config) =>
  withEntitlementsPlist(config, (mod) => {
    delete mod.modResults["aps-environment"];
    return mod;
  });
