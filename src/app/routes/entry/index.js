import {
    HtmlElement,
    Section,
    NumberField,
    Repeater,
    Button,
    DateField,
    LookupField,
    PureContainer,
    Icon,
    FlexRow,
    FlexCol
} from 'cx/widgets';
import {bind, expr, LabelsTopLayout} from 'cx/ui';

import Controller from './Controller';

import {categories} from '../../data/categories';

export default <cx>
    <Section mod="card" controller={Controller} title={expr("{$route.type}==='income' ? 'Add Income' : 'Add Expense'")}>
        <Repeater records={bind('$page.categories')}>
            <Button
                text={bind("$record.name")}
                onClick="selectCategory"
                pressed={expr("{$record.id}=={$page.activeCategoryId}")}
            />
        </Repeater>
        <FlexCol if={expr('{$page.entries.length} > 0')}>
            <DateField label="Date" value={bind("$page.date")} showClear={false} segment='date' />

            <Repeater records={bind("$page.entries")} keyField="id">
                <div>
                    <NumberField
                        value={bind("$record.amount")}
                        label={bind("$record.label")}
                        format="currency;;2"
                        placeholder="$"
                    />
                    <Button icon="add" mod="hollow" if={expr("{$record.amount} > 0")} onClick="addEntry" />
                </div>
            </Repeater>

            <LookupField
                label="Occurence"
                value={bind('$page.repeat', 0)}
                optionIdField="occurence"
                options={bind('$page.occurence')} icon="refresh"
                showClear={false} />

            <DateField if={expr('{$page.repeat} !== "once"')}
                label="Until"
                value={bind('$page.until')}
                minValue={bind('$page.date')}
                required
                minExclusive
                showClear={false}
                segment='date' />

            <br />
            
            <Button mod="primary"
                style="align-self: flex-start;"
                onClick="save"
                disabled={expr('!{$page.valid}')}
                text="Save" />
        </FlexCol>
    </Section>
</cx>
