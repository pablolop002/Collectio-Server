/* Update Items on ItemImages {insert|update|delete} */
    create trigger update_items_on_itemsImage_insert
    after insert
    on ItemImages
    for each row
    update Items
    set UpdatedAt = CURRENT_TIMESTAMP
    WHERE Id = new.ItemId;

create trigger update_items_on_itemsImage_update
    after update
    on ItemImages
    for each row
    update Items
    set UpdatedAt = CURRENT_TIMESTAMP
    WHERE Id = new.ItemId;

create trigger update_items_on_itemsImage_delete
    after delete
    on ItemImages
    for each row
    update Items
    set UpdatedAt = CURRENT_TIMESTAMP
    WHERE Id = old.ItemId;

/* Update Collections on Items {insert|update|delete} */
create trigger update_collections_on_items_insert
    after insert
    on Items
    for each row
    update Collections
    set UpdatedAt = CURRENT_TIMESTAMP
    WHERE Id = new.CollectionId;

create trigger update_collections_on_items_update
    after update
    on Items
    for each row
    update Collections
    set UpdatedAt = CURRENT_TIMESTAMP
    WHERE Id = new.CollectionId;

create trigger update_collections_on_items_delete
    after delete
    on Items
    for each row
    update Collections
    set UpdatedAt = CURRENT_TIMESTAMP
    WHERE Id = old.CollectionId;