import test from "node:test";
import assert from "node:assert/strict";
import { assertSetupSheetOwnership } from "../scripts/setup-discovery-google.mjs";
test("setup refuses shared, read-only, trashed or non-spreadsheet destinations",()=>{
  const owned={mimeType:"application/vnd.google-apps.spreadsheet",trashed:false,capabilities:{canEdit:true},owners:[{emailAddress:"mukesh.das@saavantus.com"}]};
  assert.doesNotThrow(()=>assertSetupSheetOwnership(owned));
  for(const patch of [{owners:[{emailAddress:"other@example.com"}]},{capabilities:{canEdit:false}},{trashed:true},{mimeType:"application/pdf"},{owners:undefined}]) assert.throws(()=>assertSetupSheetOwnership({...owned,...patch}),/owned and editable/);
});
