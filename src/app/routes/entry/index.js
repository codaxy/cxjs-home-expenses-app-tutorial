import {
    HtmlElement,
    Section,
    NumberField,
    Button,
    DateField,
    LookupField,
    TextField,
    PureContainer,
    ValidationGroup,
    Icon,
    FlexRow,
    Repeater,
    FlexCol
} from 'cx/widgets';
import {bind, expr, computable, LabelsTopLayout} from 'cx/ui';

import Controller from './Controller';
import {categories} from "../../data/categories";

export default <cx>
    <h2 putInto="header" if={expr('{$route.id} == "new"')}>Add Entry</h2>
    <h2 putInto="header" if={expr('{$route.id} != "new"')}>Edit Entry</h2>
    <Section
        mod="card"
        controller={Controller}
    >
        <FlexRow visible={expr("!{$page.entry.categoryId}")} wrap spacing>
            <Repeater records={categories}>
                <div class="category" onClick="selectCategory">
                    <span text:tpl="{$record.name}"/>
                    <img src={computable('$record.name', name => {
                        return `~/assets/category/${name.replace('/', '-').toLowerCase()}.svg`;
                    })} />
                </div>
            </Repeater>
        </FlexRow>
        <ValidationGroup
            valid={bind("$page.valid")}
            visible={expr("!!{$page.entry.categoryId}")}
        >
            <FlexCol>
                <DateField
                    label="Date"
                    value={bind("$page.entry.date")}
                    required
                    autoFocus
                />

                <NumberField
                    value={bind("$page.entry.amount")}
                    label="Amount"
                    format="currency;;2"
                    placeholder="$"
                    required
                />

                <LookupField
                    value={bind('$page.entry.categoryId')}
                    options={categories}
                    optionTextField="name"
                    label="Category"
                    required
                />

                <TextField
                    value={bind('$page.entry.description')}
                    label="Description"
                    style="width: 100%; max-width: 500px"
                />

                <br/>
                <FlexRow spacing>
                    <Button
                        onClick="back"
                        text="Back"
                    />

                    <Button
                        mod="primary"
                        onClick="save"
                        disabled={expr('!{$page.valid}')}
                        text="Save"
                    />
                </FlexRow>

            </FlexCol>
        </ValidationGroup>
    </Section>
</cx>
