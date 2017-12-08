import { Grid, Button, LinkButton, Section } from 'cx/widgets';
import {computable, bind} from 'cx/ui';
import {enableMsgBoxAlerts} from 'cx/widgets';

enableMsgBoxAlerts();

import Controller from './Controller';

import {categoryNames} from '../../data/categories';

export default <cx>
    <h2 putInto="header">Log</h2>
    <Section
        mod="card"
        controller={Controller}
        style="height: 100%"
        bodyStyle="display: flex; flex-orientation: column"
    >
        <Grid
            records-bind="entries"
            lockColumnWidths
            scrollable
            buffered
            style="flex: 1 0 0%"
            columns={[
                {
                    field: 'date',
                    header: 'Date',
                    format: 'date',
                    sortable: true
                },
                {
                    field: 'description',
                    header: 'Description',
                    style: 'width: 50%'
                },
                {
                    field: 'categoryId',
                    header: 'Category',
                    sortable: true,
                    value: computable("$record.categoryId", id => categoryNames[id])
                },
                {
                    field: 'amount',
                    header: 'Amount',
                    format: "currency;;2",
                    align: 'right',
                    sortable: true
                },
                {

                    header: 'Actions',
                    align: 'center',
                    children: <cx>
                        <LinkButton mod="hollow" href-tpl="~/entry/{$record.id}">
                            Edit
                        </LinkButton>
                        <Button mod="hollow" 
                            onClick="remove"
                            confirm="Are you sure you want to delete this entry?">
                            Remove
                        </Button>
                    </cx>
                }
            ]}
        />
    </Section>
</cx>
