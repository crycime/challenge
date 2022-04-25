import * as _ from 'lodash';

export const parseDescription = ({
  keyPts,
  diagram = '',
}: {
  keyPts: string[];
  diagram?: string;
}): string =>
  `__Key Points__:\n${_.chain(keyPts)
    .map((pt) => `- ${pt}`)
    .join('\n')
    .value()}${diagram ? '\n\n __Sequence Diagram__:\n\n' : ''}${diagram}`;
