import { create } from 'ipfs-http-client';
import { v4 as uuidv4 } from 'uuid';

const client = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
});

export const uploadIpfs = async (data: any) => {
    return await client.add(JSON.stringify(data))
};
