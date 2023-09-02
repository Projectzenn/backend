import { Polybase } from '@polybase/client';
import { ethPersonalSign } from '@polybase/eth';
import { FileCollection } from './collections/file.collection';
const NAMESPACE =
  'pk/0xd89cd07b2a59a0059a9001225dc6f2e27c207cc2e8df89c9f4dfcb1673f1c25b201619d55d529a0c016ea157b79abbfd26b9e57405a1de29682df4c215e32dd2/careerzen';

export const db = new Polybase({
  signer: (data: any) => {
    return {
      h: 'eth-personal-sign',
      sig: ethPersonalSign(process.env.PRIVATE_KEY, data),
    };
  },
  defaultNamespace: NAMESPACE,
});

export const initPolybase = async () => {
  try {
    await db.applySchema(FileCollection);
  } catch {}
};
