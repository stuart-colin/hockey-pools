import React, { useMemo } from 'react';
import {
  Header,
  Icon,
  Label,
  Segment,
  Table,
} from 'semantic-ui-react';

const TodaysMovers = ({ rankedRosters }) => {
  const movers = useMemo(() => {
    return [...rankedRosters]
      .filter(r => r.livePoints > 0)
      .sort((a, b) => b.livePoints - a.livePoints);
  }, [rankedRosters]);

  if (movers.length === 0) return null;

  return (
    <Segment>
      <Header
        color='green'
        size='small'
        style={{ marginBottom: '0.5em' }}
      >
        <Icon name='lightning' />
        Today&apos;s Movers
      </Header>
      <Table
        basic='very'
        compact
        singleLine
        unstackable
      >
        <Table.Body>
          {movers.map((roster, index) => (
            <Table.Row key={roster.owner.id}>
              <Table.Cell
                collapsing
                style={{ color: '#999', fontSize: '0.85em' }}
              >
                {index + 1}
              </Table.Cell>
              <Table.Cell>
                {roster.owner.name}
              </Table.Cell>
              <Table.Cell collapsing>
                <Label
                  color='green'
                  size='small'
                >
                  +{roster.livePoints}
                </Label>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Segment>
  );
};

export default TodaysMovers;
