export const env = {
  gatewayUrl: process.env.NEXT_PUBLIC_GATEWAY_URL,
  gatewayAuthKey: process.env.NEXT_PUBLIC_GATEWAY_AUTH_KEY ?? '',
} as const;
