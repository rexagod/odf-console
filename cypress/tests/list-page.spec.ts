import { STORAGE_SYSTEM_NAME } from "../consts";
import { detailsPage } from "../views/details-page";
import { listPage } from "../views/list-page";
import { modal } from "../views/modals";
import { ODFCommon } from "../views/odf-common";

describe('Tests storage system list page', () => {
    before(() => {
        cy.login();
        cy.visit('/');
        cy.install();
    })
    after(() => {
        cy.logout();
    });

    beforeEach(() => {
        ODFCommon.visitStorageDashboard();
    })

    it('Test default(OCS) StorageSystem is listed', () => {
        ODFCommon.visitStorageSystemList();
        listPage.searchInList(STORAGE_SYSTEM_NAME);
        // Test if the Kebab Menu contains all Items
        cy.byLegacyTestID('kebab-button').click();
        cy.byTestActionID('Add Capacity').click();
        // Check if a modal was opened
        modal.shouldBeOpened();
        cy.byLegacyTestID("modal-cancel-action").click();
        // Todo(bipuladh): Add a proper data-selector once the list page is migrated
        // eslint-disable-next-line cypress/require-data-selectors
        cy.get('a').contains(STORAGE_SYSTEM_NAME).click();
        // Title should always use h1
        detailsPage.getResourceTitle().contains(STORAGE_SYSTEM_NAME).should('exist');
        // Todo(rexagod): Add a proper data-selector once build goes through
        cy.contains('Utilization', { timeout: 5 * 60000 });
    });
});
